import React from 'react';
import ActionBase from "@/features/action/components/ActionBase";

const Page = async ({
                  params,
              }: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;

    return (
        <ActionBase id={id} />
    );
};

export default Page;