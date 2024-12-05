import { Devvit } from "@devvit/public-api";
import { MyText } from "../../components/MyText.js";
import { CustomIcon } from "../../components/CustomIcon.js";
import { Container } from "../../components/Container.js";
interface HowToPlayPageProps {
  screenWidth: number;
  onClose: () => void;
}

export const HowToPlayPage = (props: HowToPlayPageProps): JSX.Element => {
  const { screenWidth, onClose } = props;

  const maxTextWidth = screenWidth - 64 - 12 - 32;

  return (
    <vstack width="100%" height="100%" padding="large">
      {/* nav */}
      <hstack gap="medium" alignment="middle center">
        <vstack grow>
          <MyText size={0.6} mode="light">
            How To Play
          </MyText>
        </vstack>
        <CustomIcon icon="close-fill" onPress={onClose} />
      </hstack>
      <spacer height="16px" />
      <vstack gap="medium" grow>
        <Container>
          <vstack padding="medium">
            <MyText width={maxTextWidth}>
              Laddergram is a word based puzzle game. You start with a word and
              change one letter at a time to create a new word with each step.
              Compete with others and try to solve it in the fewest steps
              possible.
            </MyText>
            <spacer height="18px" />
            <MyText width={maxTextWidth}>
              You can solve laddergrams made by other people and also create
              your own -- max 3 daily. Be sure to solve the daily laddergram
              challenge to earn more points!
            </MyText>
            <spacer height="18px" />
            <MyText size={0.5} bottomMargin="8px">
              Point System:
            </MyText>
            <hstack>
              <MyText size={0.4} topMargin="3px" bottomMargin="3px">
								- Solve a 3-letter puzzle: Earn 2
              </MyText>
              <spacer width="3px" />
              <text>🪜</text>
            </hstack>
            <hstack>
              <MyText size={0.4} topMargin="3px" bottomMargin="3px">
                - Solve a 4-letter puzzle: Earn 4
              </MyText>
              <spacer width="3px" />
              <text>🪜</text>
            </hstack>
            <hstack>
              <MyText size={0.4} topMargin="3px" bottomMargin="3px">
                - Solve a 5-letter puzzle: Earn 8
              </MyText>
              <spacer width="3px" />
              <text>🪜</text>
            </hstack>
            <hstack>
              <MyText size={0.4} topMargin="3px" bottomMargin="3px">
                - Complete a Daily Challenge: Earn an extra 10
              </MyText>
              <spacer width="3px" />
              <text>🪜</text>
            </hstack>
          </vstack>
        </Container>
      </vstack>
    </vstack>
  );
};
