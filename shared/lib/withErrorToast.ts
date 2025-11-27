import toast from "react-hot-toast";
import i18n from "@/shared/lib/i18n";

type ErrorOptions = {
  messageKey?: string;
  defaultMessage?: string;
};

const translate = (key: string, defaultValue: string) =>
  i18n.t(key, { defaultValue });

const getDefaultMessage = () =>
  translate("errors.unexpected", "Something went wrong. Please try again.");

export async function withErrorToast<T>(
  action: () => Promise<T>,
  options?: ErrorOptions
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    const message = options?.messageKey
      ? translate(
          options.messageKey,
          options.defaultMessage ?? getDefaultMessage()
        )
      : getDefaultMessage();

    toast.error(message);
    throw error;
  }
}
