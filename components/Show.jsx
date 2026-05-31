import React, { Children } from "react";

/**
 * The `Show` component allows conditional rendering based on `isTrue` props,
 * similar to `if / else if / else` in traditional programming.
 *
 * Example usage:
 *
 * <Show>
 *   <Show.If isTrue={condition1}>
 *     Content if condition1 is true
 *   </Show.If>
 *   <Show.ElseIf isTrue={condition2}>
 *     Content if condition2 is true
 *   </Show.ElseIf>
 *   <Show.Else>
 *     Fallback content
 *   </Show.Else>
 * </Show>
 */
export default function Show({ children }) {
  let matchedChild = null;
  let elseChild = null;

  // Ensure we are working with an array of valid React elements
  const validChildren = Children.toArray(children);

  // Find the first "true" child or track the Else child
  validChildren.forEach((child) => {
    if (!React.isValidElement(child)) return;

    // If the child's type is Show.Else, keep a reference to it
    if (child.type?.displayName === "Show.Else") {
      elseChild = child;
    }
    // If the child has isTrue === true and we haven't matched yet, use it
    else if (child.props?.isTrue && matchedChild === null) {
      matchedChild = child;
    }
  });

  // Return either the matched "If"/"ElseIf" or the "Else" fallback
  return matchedChild || elseChild || null;
}

/**
 * Renders children if `isTrue` is true.
 */
Show.If = function ShowIf({ isTrue, children }) {
  return isTrue ? children : null;
};
Show.If.displayName = "Show.If";

/**
 * Renders children if `isTrue` is true, intended to follow after a Show.If.
 */
Show.ElseIf = function ShowElseIf({ isTrue, children }) {
  return isTrue ? children : null;
};
Show.ElseIf.displayName = "Show.ElseIf";

/**
 * Renders children if none of the previous conditions were met.
 */
Show.Else = function ShowElse({ children }) {
  return children;
};
Show.Else.displayName = "Show.Else";
