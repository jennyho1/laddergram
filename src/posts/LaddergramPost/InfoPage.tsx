import { Devvit } from "@devvit/public-api";
import { MyText } from "../../components/MyText.js";
import { CustomButton } from "../../components/CustomButton.js";
import { DifficultyBlock } from "../../components/DifficultyBlock.js";

interface InfoPageProps {
  screenWidth?: number;
  authorUsername: string;
	optimalSteps: number;
  onPress: () => void | Promise<void>;
}

export const InfoPage = (props: InfoPageProps): JSX.Element => {
  const { onPress, screenWidth = 400, authorUsername, optimalSteps } = props;

  const titleLogoWidth = screenWidth < 400 ? screenWidth - 64 : 400;
  const descriptionWidth = screenWidth < 350 ? screenWidth - 74 : 350;

	// Easy: 2-3
	// Medium: 4-5
	// Hard: 6-7
	// Very Hard: 8-10
	// Master: 11-15
	// Insanity: 16+

	let difficultyNumber = 1
	if (optimalSteps >= 16) {
		difficultyNumber = 6;
	} else if (optimalSteps >= 11) {
		difficultyNumber = 5;
	} else if (optimalSteps >= 8) {
		difficultyNumber = 4;
	} else if (optimalSteps >= 6) {
		difficultyNumber = 3;
	} else if (optimalSteps >= 4) {
		difficultyNumber = 2;
	} else {
		difficultyNumber = 1;
	} 

  return (
		<vstack
			alignment="center middle"
			padding="medium"
			gap="large"
			width="100%"
			height="100%"
		>
			<image
				url="logo.png"
				description="logo"
				imageHeight={500}
				imageWidth={500}
				height="64px"
				width="64px"
			/>
			<image
				url="titleLogo.png"
				description="Title logo"
				imageWidth={titleLogoWidth}
				imageHeight={titleLogoWidth / 7.6981}
			/>
			<vstack alignment="center middle">
				{screenWidth < 400 ? (
					<vstack alignment="center middle">
						<MyText size={0.5} mode="light">
							Start with a word and change
						</MyText>
						<MyText size={0.5} topMargin="2px" mode="light">
							one letter at a time to create
						</MyText>
						<MyText size={0.5} topMargin="7px" mode="light">
							a new word with each step.
						</MyText>
						<MyText size={0.5} topMargin="2px" mode="light">
							Try to reach the target word
						</MyText>
						<MyText size={0.5} topMargin="2px" mode="light">
							in the fewest steps possible.
						</MyText>
					</vstack>
				) : (
					<vstack alignment="center middle">
						<MyText size={0.5} mode="light">
							Start with a word and change one letter
						</MyText>
						<MyText size={0.5} topMargin="3px" mode="light">
							at a time to create a new word with
						</MyText>
						<MyText size={0.5} topMargin="7px" mode="light">
							each step. Try to reach the target
						</MyText>
						<MyText size={0.5} topMargin="3px" mode="light">
							word in the fewest steps possible.
						</MyText>
					</vstack>
				)}
			</vstack>

			<hstack alignment="center middle" gap={screenWidth < 400 ? "small" : "medium"}>
				<DifficultyBlock difficulty={difficultyNumber}/>
				<vstack alignment="middle center" >
					{authorUsername != "laddergram" ? (
						<MyText size={0.35} mode="med" bottomMargin="3px">
							{`Posted by u/${authorUsername}`}
						</MyText>
					) : null}
					<spacer height="2px"/>
					<CustomButton
						label="Solve laddergram"
						width={180}
						height={45}
						onPress={onPress}
					/>
				</vstack>
			</hstack>

		</vstack>

  );
};
