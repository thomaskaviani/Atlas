export class LoggingService {

    public static initializeLogFile() {
        require('child_process').exec("sudo rm -f /opt/logfile.txt", function (msg) {
            console.log(msg)
        });
        require('child_process').exec("sudo touch /opt/logfile.txt", function (msg) {
            console.log(msg)
        });
    }

    public static logOnFile(message: string) {
        require('child_process').exec("echo '" + message + "' >> /opt/logfile.txt", function (msg) {
            console.log(msg)
        });
    }

    public static log(message: string): void {
        console.log(Date.now() + ":" + message);
    }

    public static logWithError(message: string, error: any): void {
        console.log(Date.now() + ":" + message, error);
    }

    public static logWithBoardgameAndOwner(message: string, boardgame: string, owner: string) {
        console.log(Date.now() + ":" + message + "-" + boardgame + "-" + owner);
    }

    public static logWithBoardgame(message: string, boardgame: string) {
        console.log(Date.now() + ":" + message + "-" + boardgame);
    }

    public static logWithOwner(message: string, owner: string) {
        console.log(Date.now() + ":" + message + "-" + owner);
    }
}