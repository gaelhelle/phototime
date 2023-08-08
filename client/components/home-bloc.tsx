import React from "react";

interface HomeBlocProps {
  title: string;
  children: React.ReactNode;
}

export default function HomeBloc(props: HomeBlocProps) {
  const { title, children } = props;

  return (
    <div className="bg-black/20 rounded-lg p-10">
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <div className="text-xs">{children}</div>
    </div>
  );
}
