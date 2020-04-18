import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
    header: {
        padding: 20,
        height: 80,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #3C3F43"
    },
    messageInput: {
        background: "none",
        border: 0,
        padding: 11
    },
    footer: {
        border: 0,
        alignItems: "center"
    },
    blueIcon: {
        color: "#3498FF"
    }
});
