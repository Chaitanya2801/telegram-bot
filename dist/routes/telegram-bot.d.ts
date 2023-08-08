declare const Telegraf: any, Markup: any;
declare const Client: any;
declare const fs: any;
declare const Router: any;
declare const setBotCommands: any;
declare const token = "6223171691:AAHxCmwnExLxmcrd10do-lLtbtifwpZPcPQ";
declare const client: any;
declare const bot: any;
declare const additionalCommands: {
    command: string;
    description: string;
}[];
declare function getCommandsFromDatabase(): Promise<any>;
declare function getResponseFromDatabase(commandName: any): Promise<any>;
declare function handleCommand(ctx: any): Promise<void>;
declare const router: any;
