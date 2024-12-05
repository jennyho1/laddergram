import { Devvit } from "@devvit/public-api";

interface ContainerProps {
  children: JSX.Element;
}

export function Container(props: ContainerProps): JSX.Element {
  const { children } = props;

  return (
    <vstack border="thick" borderColor="#4e1e15">
      <vstack border="thin" borderColor="#4e1e15">
        <vstack width="100%" height="3px" backgroundColor="#ffe2bf"></vstack>
        <hstack>
          <vstack width="3px" height="100%" backgroundColor="#ffe2bf"></vstack>
          <vstack backgroundColor="#e2a868" grow>
            {children}
          </vstack>
          <vstack width="3px" height="100%" backgroundColor="#c77f45"></vstack>
        </hstack>
        <vstack width="100%" height="3px" backgroundColor="#c77f45"></vstack>
      </vstack>
    </vstack>
  );
}
