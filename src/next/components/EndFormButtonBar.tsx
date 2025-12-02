import { Button } from "@mui/material";
import Link from "next/link";
import StartIcon from "@mui/icons-material/Start";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";

export type EndFormButtonBarProps = {
  onResetButtonClick: () => void;
  /** If provided, the "Next" button will redirect to this URL.
   * If not, the "Next" button will not be rendered */
  nextButtonHref?: string;
};

export function EndFormButtonBar({
  onResetButtonClick,
  nextButtonHref,
}: EndFormButtonBarProps) {
  return (
    <>
      <div className="button-bar-spacer h-18"></div>
      <div className="fixed flex gap-4 bottom-0 rounded-t-lg bg-white p-4 shadow-2xl shadow-gray-700 left-1/2 -translate-x-1/2 z-10">
        <Button
          type="button"
          variant="contained"
          size="large"
          color="warning"
          className="flex items-center gap-2"
          onClick={onResetButtonClick}
        >
          <RefreshIcon /> Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          size="large"
          className="flex items-center gap-2"
        >
          <SaveIcon /> Save
        </Button>
        {nextButtonHref && (
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            className="flex items-center gap-2"
          >
            <Link
              className="w-full h-full flex items-center gap-2"
              href={nextButtonHref}
            >
              <StartIcon /> Next
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}
