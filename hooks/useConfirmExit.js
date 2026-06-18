import { useState, useEffect, useRef } from "react";
import { useNavigation } from "expo-router";
import { BackHandler } from "react-native";

/**
 * Reusable hook to intercept back navigation / screen removal and prompt user confirmation.
 * @param {boolean} isEnabled - Toggle active listener.
 * @returns {object} { isOpen, setIsOpen, confirmExit, cancelExit }
 */
export function useConfirmExit(isEnabled = true) {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const isConfirmedRef = useRef(false);
  const pendingActionRef = useRef(null);

  useEffect(() => {
    if (!isEnabled) return;

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // If already confirmed, let normal transition proceed
      if (isConfirmedRef.current) {
        return;
      }

      // Intercept transition
      e.preventDefault();
      pendingActionRef.current = e.data.action;
      setIsOpen(true);
    });

    return unsubscribe;
  }, [navigation, isEnabled]);

  useEffect(() => {
    if (!isOpen) return;

    const backAction = () => {
      cancelExit();
      return true; // Intercepted and handled
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isOpen]);

  const confirmExit = () => {
    setIsOpen(false);
    isConfirmedRef.current = true;
    if (pendingActionRef.current) {
      navigation.dispatch(pendingActionRef.current);
    }
  };

  const cancelExit = () => {
    setIsOpen(false);
    pendingActionRef.current = null;
  };

  return {
    isOpen,
    setIsOpen,
    confirmExit,
    cancelExit,
  };
}
