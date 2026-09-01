import CardGeneral from "./CardGeneral";

export type FileCardI = {
  icon: string;
  label: string;
  value: string;
};

export default function FileCard({ icon, label, value }: FileCardI) {
  return (
    <div className="w-full h-auto [&_.icon-set]:!border-primary-600">
      <CardGeneral
        variant="primary-100"
        iconDefault={icon}
        subtitleText={label}
        titleText={value}
        descriptionText=""
      />
    </div>
  );
}
