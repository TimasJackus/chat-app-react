import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
    container: {
        background: "#f5f5f5",
        height: "100%",
    },
    header: {
        height: 60,
        padding: "20px 20px 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#FFF",
        boxShadow: "3px 1px 5px 0px #dedede",
    },
    content: {
        height: "calc(100% - 100px)",
        overflow: "auto",
    },
    input: {
        // background: "none",
        background: "#FFF",
        fontSize: 13,
        border: 4,
        padding: 10,
    },
    footer: {
        // height: 40,
        padding: 10,
        border: 0,
        alignItems: "center",
    },
    blueIcon: {
        color: "#3498FF",
    },
});
