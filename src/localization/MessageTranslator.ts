import type {ErrorMessage} from "../interfaces/AuthTypes.ts";

type ErrorCode = "wrong_password" | "user_not_found" | "email_already_registered" | "username_already_registered";

const errorMessages: Record<ErrorCode, string> = {
    wrong_password: "Неверный пароль",
    user_not_found: "Указанный пользователь не найден",
    email_already_registered: "Пользователь с таким адресом эл. почты уже существует",
    username_already_registered: "Данное имя пользователя уже занято, попробуйте другое",
};

export function translateError(errorMessage: ErrorMessage): string {
    if (errorMessage.error in errorMessages) {
        return errorMessages[errorMessage.error as ErrorCode];
    }
    return errorMessage.error;
}

export function translateMessage(message: string): string {
    if (message in errorMessages) {
        return errorMessages[message as ErrorCode];
    }
    return message;
}