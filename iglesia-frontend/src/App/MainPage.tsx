import { AppLayout } from "./Layout/AppLayout";
import { ContentRouter } from "./router/ContentRouter";

export const MainPage = () => {
  return (
    <AppLayout>
      <ContentRouter />
    </AppLayout>
  );
};
