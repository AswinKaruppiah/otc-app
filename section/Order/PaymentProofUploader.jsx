import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Platform,
  Linking,
  TextInput,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { haptic } from "../../utils/haptics";
import { isImageFile, formatFileSize, getUtrDetails } from "../../utils/helper";
import Show from "../../components/Show";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { useToast } from "heroui-native";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export const PaymentProofUploader = ({
  onProofsChanged,
  requiredAmount = 0,
  totalUploadedAmount = 0,
}) => {
  const [proofs, setProofs] = useState([]); // List of all uploaded proofs
  const [file, setFile] = useState(null); // Current selected file
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [utr, setUtr] = useState("");
  const [type, setType] = useState("UPI");
  const { toast } = useToast();

  const handleTypeChange = (newType) => {
    haptic.light();
    setType(newType);
    if (!title.trim() || ["UPI Proof", "RTGS Proof", "NEFT Proof", "IMPS Proof"].includes(title.trim())) {
      setTitle(`${newType} Proof`);
    }
  };

  useEffect(() => {
    onProofsChanged?.(proofs);
  }, [proofs]);

  const handleNativePreview = async (f) => {
    if (!f || !f.uri) return;
    haptic.light();
    try {
      if (Platform.OS === "android") {
        try {
          let contentUri = f.uri;
          if (f.uri.startsWith("file://")) {
            contentUri = await FileSystem.getContentUriAsync(f.uri);
          }
          await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: contentUri,
            flags: 1, // Intent.FLAG_GRANT_READ_URI_PERMISSION
            type: f.mimeType || (f.name?.endsWith(".pdf") ? "application/pdf" : "image/*"),
          });
        } catch (intentErr) {
          console.warn("IntentLauncher failed, falling back to Sharing:", intentErr);
          const isAvailable = await Sharing.isAvailableAsync();
          if (isAvailable) {
            await Sharing.shareAsync(f.uri, {
              mimeType: f.mimeType,
              dialogTitle: f.name,
            });
          } else {
            throw intentErr;
          }
        }
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(f.uri, {
            mimeType: f.mimeType,
            dialogTitle: f.name,
          });
        } else {
          await Linking.openURL(f.uri);
        }
      }
    } catch (error) {
      console.error("Native preview error:", error);
      toast.show({
        label: "Open Failed",
        description: "Could not open this file. Make sure you have a PDF viewer or gallery app installed.",
        variant: "danger",
      });
    }
  };

  const pickFile = async () => {
    if (requiredAmount > 0 && totalUploadedAmount >= requiredAmount) {
      toast.show({
        label: "Already Matched",
        description: "The required amount is already fully matched.",
        variant: "warning",
      });
      return;
    }
    haptic.light();
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        const allowedExtensions = ["pdf", "png", "jpg", "jpeg"];
        const fileExtension = pickedFile.name?.split(".").pop()?.toLowerCase();

        const isMimeAllowed =
          pickedFile.mimeType &&
          (pickedFile.mimeType === "application/pdf" ||
            pickedFile.mimeType.startsWith("image/jpeg") ||
            pickedFile.mimeType.startsWith("image/png"));

        const isExtAllowed = allowedExtensions.includes(fileExtension);

        if (!isMimeAllowed && !isExtAllowed) {
          toast.show({
            label: "Unsupported File",
            description: "Please upload a PDF, PNG, JPG, or JPEG file.",
            variant: "danger",
          });
          setLoading(false);
          return;
        }

        if (pickedFile.size && pickedFile.size > MAX_SIZE) {
          toast.show({
            label: "File Too Large",
            description: "Please upload a file smaller than 5 MB.",
            variant: "danger",
          });
          setLoading(false);
          return;
        }
        setFile(pickedFile);
        if (!title.trim()) {
          setTitle(`${type} Proof`);
        }
        toast.show({
          label: "Success",
          description: "Payment proof has been selected. Please fill in the details.",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Document pick error:", error);
      toast.show({
        label: "Error",
        description: "Failed to select document. Please try again.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    haptic.medium();
    setFile(null);
    setTitle("");
    setAmount("");
    setUtr("");
    setType("UPI");
  };

  const handleAmountChange = (text) => {
    let cleaned = text.replace(/,/g, "");
    const dotIndex = cleaned.indexOf(".");
    if (dotIndex !== -1) {
      const integerPart = cleaned.substring(0, dotIndex);
      const decimalPart = cleaned.substring(dotIndex + 1).replace(/\./g, "").substring(0, 2);
      cleaned = `${integerPart}.${decimalPart}`;
    }
    cleaned = cleaned.replace(/[^0-9.]/g, "");
    setAmount(cleaned);
  };

  const remainingAmount = requiredAmount - totalUploadedAmount;
  const enteredVal = parseFloat(amount) || 0;
  const isAmountValid = enteredVal > 0 && enteredVal <= remainingAmount + 0.01;
  const isCurrentFormValid = !!(file && title.trim() && amount.trim() && utr.trim() && type && isAmountValid);

  const addProof = () => {
    if (!isCurrentFormValid) return;
    haptic.success();
    const newProof = {
      ...file,
      title: title.trim(),
      amount: amount.trim(),
      utr: utr.trim(),
      paymentType: type,
    };
    setProofs((prev) => [...prev, newProof]);

    // Clear current inputs for next upload
    setFile(null);
    setTitle("");
    setAmount("");
    setUtr("");
    setType("UPI");

    toast.show({
      label: "Proof Added",
      description: "Payment proof has been added to the list.",
      variant: "success",
    });
  };

  const deleteProof = (idx) => {
    haptic.medium();
    setProofs((prev) => prev.filter((_, i) => i !== idx));
    toast.show({
      label: "Proof Removed",
      description: "Payment proof has been removed.",
      variant: "success",
    });
  };

  return (
    <View className="w-full">
      {/* Section Header */}
      <View className="pl-1 gap-1 mb-3">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          Proof of Payment
        </Text>
        <Text className="text-gray-500 font-noir text-xs leading-normal">
          Upload screenshots of your bank transfers as proof of payment.
        </Text>
      </View>

      {/* Uploaded Proofs List */}
      <Show>
        <Show.If isTrue={proofs.length > 0}>
          <View className="mb-4 gap-2.5">
            <Text className="text-gray-400 font-noir-medium text-[11px] uppercase tracking-wider pl-1">
              Uploaded Proofs ({proofs.length})
            </Text>
            {proofs.map((proof, idx) => (
              <View
                key={idx}
                className="w-full flex-row items-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 gap-3"
              >
                {/* Clickable details area for native preview */}
                <Pressable
                  onPress={() => handleNativePreview(proof)}
                  className="flex-1 flex-row items-center gap-3"
                >
                  {/* Small preview thumbnail / file type icon */}
                  <View className="w-12 h-12 rounded-lg overflow-hidden bg-black/20 border border-white/5 items-center justify-center">
                    <Show>
                      <Show.If isTrue={isImageFile(proof)}>
                        <Image source={{ uri: proof.uri }} className="w-full h-full" resizeMode="cover" />
                      </Show.If>
                      <Show.Else>
                        <Feather name="file-text" size={20} color="#ff7b7b" />
                      </Show.Else>
                    </Show>
                  </View>

                  {/* Details */}
                  <View className="flex-1 justify-center">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-white font-noir-medium text-xs max-w-[120px]" numberOfLines={1}>
                        {proof.title}
                      </Text>
                      <View className="bg-white/[0.04] px-1.5 py-0.5 rounded-md border border-white/[0.06]">
                        <Text className="text-gray-400 font-noir text-[8px] uppercase tracking-wider">
                          {proof.paymentType}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-500 font-noir text-[10px] mt-0.5" numberOfLines={1}>
                      UTR: {proof.utr}
                    </Text>
                  </View>

                  {/* Amount */}
                  <View className="items-end justify-center mr-1">
                    <Text className="text-noirMint font-noir-medium text-xs font-semibold">
                      ₹{isNaN(Number(proof.amount)) ? proof.amount : Number(proof.amount).toLocaleString("en-IN")}
                    </Text>
                  </View>
                </Pressable>

                {/* Delete button */}
                <Pressable
                  onPress={() => deleteProof(idx)}
                  hitSlop={6}
                  className="w-6 h-6 rounded-md bg-red-500/[0.06] items-center justify-center active:bg-red-500/15"
                >
                  <Feather name="trash-2" size={11} color="#ff7b7b" />
                </Pressable>
              </View>
            ))}
          </View>
        </Show.If>
      </Show>

      {/* Upload Card */}
      <View className="rounded-xl border border-white/5">
        <View className="bg-noirBg rounded-xl p-5">
          <Show>
            <Show.If isTrue={loading}>
              <View className="items-center justify-center gap-3 py-10">
                <View className="w-14 h-14 rounded-2xl bg-noirMint/[0.06] items-center justify-center">
                  <ActivityIndicator size="small" color="#baffd8" />
                </View>
                <Text className="text-gray-400 font-noir text-xs">
                  Opening files...
                </Text>
              </View>
            </Show.If>

            <Show.ElseIf isTrue={!!file}>
              <View className="w-full gap-5">
                <Show>
                  <Show.If isTrue={isImageFile(file)}>
                    <Pressable
                      onPress={() => handleNativePreview(file)}
                      className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-white/[0.06] bg-black/30 active:opacity-90"
                    >
                      <Image
                        source={{ uri: file?.uri }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.75)"]}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 56,
                          flexDirection: "row",
                          alignItems: "flex-end",
                          justifyContent: "space-between",
                          paddingHorizontal: 14,
                          paddingBottom: 10,
                        }}
                      >
                        <View className="flex-row items-center gap-1.5">
                          <Feather name="maximize-2" size={11} color="rgba(255,255,255,0.7)" />
                          <Text className="text-white/70 font-noir text-[10px]">
                            Tap to preview
                          </Text>
                        </View>
                        <Text className="text-white/40 font-noir text-[10px]">
                          {formatFileSize(file?.size)}
                        </Text>
                      </LinearGradient>
                    </Pressable>
                  </Show.If>

                  <Show.Else>
                    <Pressable
                      onPress={() => handleNativePreview(file)}
                      className="w-full flex-row items-center bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 gap-3.5 active:bg-white/[0.06]"
                    >
                      <View className="w-12 h-12 rounded-xl bg-red-500/[0.08] border border-red-500/15 items-center justify-center">
                        <Feather name="file-text" size={22} color="#ff7b7b" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-noir text-[13px]" numberOfLines={1} ellipsizeMode="middle">
                          {file?.name}
                        </Text>
                        <Text className="text-gray-500 font-noir text-[11px] mt-0.5">
                          {formatFileSize(file?.size)} • PDF Document (Tap to view)
                        </Text>
                      </View>
                      <Pressable
                        onPress={removeFile}
                        hitSlop={6}
                        className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] items-center justify-center active:bg-red-500/10"
                      >
                        <Feather name="trash-2" size={15} color="#ff7b7b" />
                      </Pressable>
                    </Pressable>
                  </Show.Else>
                </Show>

                {/* Form fields: Title, Amount, UTR, Type */}
                <View className="border-t border-white/5 pt-5 gap-4">
                  <Text className="text-white font-noir-medium text-xs tracking-wider uppercase mb-1">
                    Receipt Details
                  </Text>

                  {/* Title Input */}
                  <View className="gap-1.5">
                    <Text className="text-gray-400 font-noir-medium text-[11px] uppercase tracking-wider">
                      Title
                    </Text>
                    <View className="w-full rounded-md border border-white/[0.06] bg-noirBg flex-row items-center px-2 py-3">
                      <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="e.g. Bank Transfer Proof"
                        placeholderTextColor="rgba(255,255,255,0.18)"
                        className="text-noirText font-noir text-[15px] flex-1"
                        style={{ paddingVertical: 0 }}
                      />
                    </View>
                  </View>

                  {/* Amount Input */}
                  <View className="gap-1.5">
                    <Text className="text-gray-400 font-noir-medium text-[11px] uppercase tracking-wider">
                      Amount (INR)
                    </Text>
                    <View className="w-full rounded-md border border-white/[0.06] bg-noirBg flex-row items-center px-2 py-3">
                      <Text className="text-white/50 font-noir text-[15px] mr-1.5">₹</Text>
                      <TextInput
                        value={amount}
                        onChangeText={handleAmountChange}
                        placeholder="0.00"
                        placeholderTextColor="rgba(255,255,255,0.18)"
                        keyboardType="decimal-pad"
                        className="text-noirText font-noir text-[15px] flex-1"
                        style={{ paddingVertical: 0 }}
                      />
                    </View>
                  </View>

                  {/* Type Selector */}
                  <View className="gap-1.5">
                    <Text className="text-gray-400 font-noir-medium text-[11px] uppercase tracking-wider">
                      Transfer Type
                    </Text>
                    <View className="flex-row w-full bg-white/[0.02] border border-white/[0.06] p-1 rounded-md">
                      {["UPI", "RTGS", "NEFT", "IMPS"].map((t) => {
                        const isSelected = type === t;
                        return (
                          <Pressable
                            key={t}
                            onPress={() => handleTypeChange(t)}
                            className="flex-1 rounded-md overflow-hidden"
                          >
                            <Show>
                              <Show.If isTrue={isSelected}>
                                <LinearGradient
                                  colors={["#baffd8", "#6df0a3"]}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  className="w-full py-2.5 items-center justify-center"
                                >
                                  <Text className="font-noir-medium text-[11px] text-[#0b0e11]">
                                    {t}
                                  </Text>
                                </LinearGradient>
                              </Show.If>
                              <Show.Else>
                                <View className="w-full py-2 items-center justify-center active:bg-white/[0.04]">
                                  <Text className="font-noir-medium text-[11px] text-gray-500">
                                    {t}
                                  </Text>
                                </View>
                              </Show.Else>
                            </Show>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  {/* UTR Input */}
                  <View className="gap-1.5">
                    <Text className="text-gray-400 font-noir-medium text-[11px] uppercase tracking-wider">
                      {getUtrDetails(type).label}
                    </Text>
                    <View className="w-full rounded-md border border-white/[0.06] bg-noirBg flex-row items-center px-2 py-3">
                      <TextInput
                        value={utr}
                        onChangeText={setUtr}
                        placeholder={getUtrDetails(type).placeholder}
                        placeholderTextColor="rgba(255,255,255,0.18)"
                        keyboardType="default"
                        maxLength={22}
                        className="text-noirText font-noir text-[15px] flex-1"
                        style={{ paddingVertical: 0 }}
                      />
                    </View>
                  </View>
                </View>

                {/* Form Buttons */}
                <View className="flex-row gap-3 mt-1">
                  <Pressable
                    onPress={removeFile}
                    className="flex-1 h-11 bg-white/5 border border-white/[0.06] rounded-md items-center justify-center active:bg-white/10"
                  >
                    <Text className="text-gray-400 font-noir">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={addProof}
                    disabled={!isCurrentFormValid}
                    className={`flex-1 h-11 rounded-md items-center justify-center ${isCurrentFormValid ? "bg-noirMint active:opacity-90" : "bg-noirMint/20 opacity-50"
                      }`}
                  >
                    <Text className={`font-noir-medium ${isCurrentFormValid ? "text-[#0b0e11]" : "text-gray-500"}`}>
                      Add Proof
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Show.ElseIf>

            <Show.Else>
              <Show>
                <Show.If isTrue={requiredAmount > 0 && totalUploadedAmount >= requiredAmount}>
                  <View className="w-full border border-dashed border-white/10 rounded-lg py-12 items-center justify-center bg-white/[0.01]">
                    <View className="w-16 h-16 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 items-center justify-center mb-3.5">
                      <Feather name="check-circle" size={28} color="#6df0a3" />
                    </View>
                    <Text className="text-white font-noir-medium text-sm mb-1.5">
                      Amount Matched
                    </Text>
                    <Text className="text-gray-500 font-noir text-[11px] text-center">
                      No additional proofs required.
                    </Text>
                  </View>
                </Show.If>
                <Show.Else>
                  <Pressable
                    onPress={pickFile}
                    className="w-full border border-dashed border-noirMint/15 rounded-lg py-12 items-center justify-center bg-noirMint/[0.015] active:bg-noirMint/[0.04]"
                  >
                    <View className="w-16 h-16 rounded-2xl bg-noirMint/[0.06] border border-noirMint/10 items-center justify-center mb-3.5">
                      <Feather name="upload-cloud" size={28} color="#baffd8" />
                    </View>
                    <Text className="text-white font-noir-medium text-sm mb-1.5">
                      Upload Receipt
                    </Text>
                    <Text className="text-gray-500 font-noir text-[11px] text-center">
                      PDF, PNG, or JPG — up to 5 MB
                    </Text>
                  </Pressable>
                </Show.Else>
              </Show>
            </Show.Else>
          </Show>
        </View>
      </View>
    </View>
  );
};
