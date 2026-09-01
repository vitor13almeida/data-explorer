import CardGeneral from "./CardGeneral";

export type FileCardI = {
  icon: string;
  label: string;
  value: string;
};

export default function FileCard({ icon, label, value }: FileCardI) {
  return (
    <CardGeneral
      variant="primary-100"
      iconDefault={icon}
      subtitleText={label}
      titleText={value}
      descriptionText=""
    />
  );
}
