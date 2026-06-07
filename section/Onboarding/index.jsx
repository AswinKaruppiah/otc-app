import { useState, useEffect } from "react";
import { View } from "react-native";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useToast } from "heroui-native";
import { useUser } from "../../hooks/useUser";
import { UPDATE_USER_PROFILE } from "../../apollo/mutation";
import { GET_USER } from "../../apollo/query";
import WelcomeScreen from "./Welcome";
import AccountTypeStep from "./AccountType";
import ProfileDetailsStep from "./ProfileDetails";
import ReferralStep from "./Referral";
import SuccessScreen from "./Success";
import { useApolloClient } from "@apollo/client/react";
import { clearAuthSession } from "../../utils/helper";

export default function OnboardingOverview() {
    const router = useRouter();
    const { toast } = useToast();
    const { user, loading: userLoading } = useUser();
    const apolloClient = useApolloClient();

    const [step, setStep] = useState(1);
    const [profileType, setProfileType] = useState("corporate");
    const [formData, setFormData] = useState({
        fullName: "",
        companyName: "",
        annualTurnover: "",
        referralCode: "",
    });
    const [hasPreFilled, setHasPreFilled] = useState(false);


    // Pre-fill user data if already exists in the backend (once)
    useEffect(() => {
        if (user && !hasPreFilled) {
            setFormData({
                fullName: user.fullName || "",
                companyName: user.companyName || "",
                annualTurnover: user.salaryVolume || "",
                referralCode: user.referralCode || "",
            });
            if (user.profileType) {
                setProfileType(user.profileType.toLowerCase());
            }
            setHasPreFilled(true);
        }
    }, [user, hasPreFilled]);

    // Mutation definition
    const [updateProfile, { loading: updating }] = useMutation(UPDATE_USER_PROFILE, {
        awaitRefetchQueries: true,
        refetchQueries: [{ query: GET_USER }],
        onCompleted: () => {
            toast?.show({
                label: "Profile Saved",
                description: "Your details have been successfully verified.",
                variant: "success",
            });
            // Move to success screen (Step 5)
            setStep(5);
        },
        onError: (err) => {
            toast?.show({
                label: "Update Failed",
                description: err.message || "An error occurred while saving your details.",
                variant: "danger",
            });
        },
    });

    const handleNextStep = () => {
        setStep((prev) => Math.min(prev + 1, 5));
    };

    const handlePrevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmitProfile = async () => {
        const userId = user?.id || user?.userId;
        if (!userId) {
            toast?.show({
                label: "Authentication Error",
                description: "Unable to identify user session. Please try logging in again.",
                variant: "danger",
            });
            await clearAuthSession(apolloClient);
            router.replace("/");
            return;
        }

        const variables = {
            userId,
            input: {
                fullName: formData.fullName,
                profileType,
                referralCode: formData.referralCode || "",
                salaryVolume: formData.annualTurnover,
                // Only submit company name if profile type is corporate
                ...(profileType === "corporate" ? { companyName: formData.companyName } : {}),
            },
        };

        updateProfile({ variables });
    };

    const handleFinishOnboarding = () => {
        router.replace("/");
    };

    // Render step progress indicator at the top
    return (
        <View className="w-full h-full">
            {/* Steps content */}
            {step === 1 && (
                <WelcomeScreen onNext={handleNextStep} />
            )}

            {step === 2 && (
                <AccountTypeStep
                    profileType={profileType}
                    onChangeProfileType={setProfileType}
                    onNext={handleNextStep}
                />
            )}

            {step === 3 && (
                <ProfileDetailsStep
                    profileType={profileType}
                    formData={formData}
                    setFormData={setFormData}
                    onNext={handleNextStep}
                    onBack={handlePrevStep}
                />
            )}

            {step === 4 && (
                <ReferralStep
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmitProfile}
                    onBack={handlePrevStep}
                    submitting={updating}
                />
            )}

            {step === 5 && (
                <SuccessScreen
                    onFinish={handleFinishOnboarding}
                />
            )}
        </View>
    );
}
