import { Styles, commentsCloseStyles, commentsOpenStyles } from "./commentSectionStyles";
import { editProfileClose, threePointsMenuClose } from "./profilePage";

export type AllStyles = {
    postSection: {
      commentsCloseStyles: Styles;
      commentsOpenStyles: Styles;
    };
    profileSection: string | undefined;
    threePointsMenu: {
      styles: string | undefined;
      open: boolean;
    };
};

export const allStyles: AllStyles = {
    postSection: {
      commentsCloseStyles: commentsCloseStyles,
      commentsOpenStyles: commentsOpenStyles,
    },
    profileSection: editProfileClose,
    threePointsMenu: {
      styles: threePointsMenuClose,
      open: false,
    },
};