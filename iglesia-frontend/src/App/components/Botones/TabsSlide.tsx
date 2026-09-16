import { Tab, Tabs } from "@mui/material";

export const TabsSlide = ({
  valueTab,
  onChange,
  tabs,
  cargando,
}: {
  valueTab: string;
  onChange: (event: React.SyntheticEvent<Element, Event>, value: any) => void;
  tabs: string[];
  cargando: boolean;
}) => {
  return (
    <Tabs
      value={valueTab}
      onChange={onChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
      textColor="secondary"
      indicatorColor="secondary"
    >
      {tabs.map((rol) => (
        <Tab
          label={rol}
          value={rol}
          key={rol}
          sx={{ p: 0 }}
          disabled={cargando}
        />
      ))}
    </Tabs>
  );
};
