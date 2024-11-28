import { Devvit } from "@devvit/public-api";

interface LetterBlockProps {
  label: string;
  backgroundColor?: string;
}

export const LetterBlock = (props: LetterBlockProps): JSX.Element => {
  const { label, backgroundColor } = props;

  return (
    <vstack
      width="40px"
      height="40px"
      alignment="center middle"
      backgroundColor={backgroundColor || "#c19b7a"}
      border="thick"
      borderColor="#3a322b"
    >
      <text size="xxlarge" color="#3a322b" weight="bold">
        {label}
      </text>
    </vstack>
  );
};
