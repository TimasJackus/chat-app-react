import { createUseStyles } from "react-jss";
import { ColorEnum } from "../../../types/enums/ColorEnum";

export const useStyles = createUseStyles({
    wrapper: {
        display: "flex",
        justifyContent: "flex-end",
        background: ColorEnum.BackgroundGrey,
        borderTopWidth: 1,
        borderTopColor: ColorEnum.BorderGrey,
        borderTopStyle: "solid",
        padding: "5px 10px",
        fontSize: 12,
    },
});
