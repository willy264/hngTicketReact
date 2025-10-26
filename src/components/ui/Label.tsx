import type { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = (props: LabelProps) => {
  return (
    <label
      {...props}
      className="block mb-2 text-sm font-medium text-gray-700"
    />
  );
};

export default Label;