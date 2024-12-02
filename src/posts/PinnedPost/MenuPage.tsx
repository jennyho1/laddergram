import { Devvit } from "@devvit/public-api";

interface MenuPageProps {
}

export const MenuPage = (props: MenuPageProps): JSX.Element => {
  const { } = props;

  return (
		<vstack alignment="center middle" padding="large" width="100%" height="100%">

		<spacer height="10px"/>
		
		<zstack alignment="center middle" width="100%" >

			<vstack alignment="center middle" gap="large" width="100%" maxWidth="400px">
				<hstack padding="medium" backgroundColor="#d3964d " border="thick" borderColor="#3a322b" cornerRadius="small" width="100%" alignment="center middle">
					<text color="#3a322b" size="xlarge" weight="bold"> + Create Laddergram</text>
				</hstack>
				<hstack padding="medium" backgroundColor="#d3964d " border="thick" borderColor="#3a322b" cornerRadius="small" width="100%" alignment="center middle">
					<text color="#3a322b" size="xlarge" weight="bold">Leaderboard</text>
				</hstack>
				<hstack padding="medium" backgroundColor="#d3964d " border="thick" borderColor="#3a322b" cornerRadius="small" width="100%" alignment="center middle">
					<text color="#3a322b" size="xlarge" weight="bold">My Stats</text>
				</hstack>
			</vstack>

			<hstack>
				<image imageHeight={542} imageWidth={47} url="rope.png" height="320px" description="rope"/>
				<spacer width="200px"/>
				<image imageHeight={542} imageWidth={47} url="rope.png" height="320px" description="rope"/>
			</hstack>
			
			
		</zstack>


		
	</vstack>
  );
};
