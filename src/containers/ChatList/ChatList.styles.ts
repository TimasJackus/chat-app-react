import { createUseStyles } from "react-jss";
import { ColorEnum } from "../../types/enums/ColorEnum";

export const useStyles = createUseStyles({
    container: {
        height: "100%",
        borderRight: 1,
        borderRightStyle: "solid",
        borderRightColor: ColorEnum.LighterGrey,
    },
    header: {
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 16,
        height: 60,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: 1,
        borderBottomStyle: "solid",
        borderBottomColor: ColorEnum.LighterGrey,
        marginBottom: 10,
    },
});
