import { createIntroHandler, registerIntroModalHandlers, registerIntroWelcomeHandler } from "../../features/introAuth/service";

export const introAuthHandler = createIntroHandler;
export const introAuthWelcomeHandler = registerIntroWelcomeHandler;
export const introAuthModalHandler = registerIntroModalHandlers;
