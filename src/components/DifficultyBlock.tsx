import { Devvit } from "@devvit/public-api";
import { MyText } from "./MyText.js";

interface DifficultyBlockProps {
	difficulty: number;
}

export const DifficultyBlock = (props: DifficultyBlockProps): JSX.Element => {
	const { difficulty } = props;

	let name = "Easy"
	let backgroundColor = "rgba(0, 79, 1, 0.7)"
	let borderColor = "rgba(0, 79, 1, 1)"

	if (difficulty == 1) {
		name = "Easy"
		backgroundColor = "rgba(0, 79, 1, 0.7)"
		borderColor = "rgba(0, 79, 1, 1)"
	} else if (difficulty == 2) {
		name = "Medium"
		backgroundColor = "rgba(97, 81, 0, 0.7)"
		borderColor = "rgba(97, 81, 0, 1)"
	} else if (difficulty == 3) {
		name = "Hard"
		backgroundColor = "rgba(161, 62, 0, 0.7)"
		borderColor = "rgba(161, 62, 0, 1)"
	} else if (difficulty == 4) {
		name = "Very Hard"
		backgroundColor = "rgba(118, 0, 0, 0.7)"
		borderColor = "rgba(118, 0, 0, 1)"
	} else if (difficulty == 5) {
		name = "Master"
		backgroundColor = "rgba(75, 0, 112, 0.7)"
		borderColor = "rgba(75, 0, 112, 1)"
	} else if (difficulty == 6) {
		name = "Insanity"
		backgroundColor = "rgba(0, 0, 0, 0.63)"
		borderColor = "rgb(0, 0, 0)"
	}

	return (
		<vstack
			alignment="middle center"
			backgroundColor={backgroundColor}
			padding="small"
			border="thick"
			borderColor={borderColor}
			cornerRadius="small"
			width="68px"
			height="68px"
		>

			{difficulty <= 2 ? (
				<vstack alignment="middle center" grow>
					<hstack>
						{Array.from({ length: difficulty }).map((_, index) => (
							<hstack>
								<icon name="star-fill" color="#ffe2bf" size="small"></icon>
								{index != difficulty-1 ? <spacer width="2px"/> : null}
							</hstack>
						))}
					</hstack>
				</vstack>
			) : (
				<vstack alignment="middle center">
					<hstack>
						{Array.from({ length: Math.floor(difficulty/2) }).map((_, index) => (
							<hstack>
								<icon name="star-fill" color="#ffe2bf" size="small"></icon>
								{index != Math.floor(difficulty/2)-1 ? <spacer width="2px"/> : null}
							</hstack>
						))}
					</hstack>
					<spacer height="2px"/>
					<hstack>
						{Array.from({ length: Math.ceil(difficulty/2) }).map((_, index) => (
							<hstack>
								<icon name="star-fill" color="#ffe2bf" size="small"></icon>
								{index != Math.ceil(difficulty/2)-1 ? <spacer width="2px"/> : null}
							</hstack>
						))}
					</hstack>
				</vstack>
			)}


			<spacer height="6px"/>
			<MyText size={0.35} mode="light">
				{`${name}`}
			</MyText>

		</vstack>
	);
};
