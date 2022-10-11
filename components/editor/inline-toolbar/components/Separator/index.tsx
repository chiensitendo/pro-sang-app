import React, { ReactElement } from 'react';

interface SeperatorProps {
    className?: string;
}

export default function Seperator({
                                      className = "separator",
                                  }: SeperatorProps): ReactElement {
    return <div className={className} />;
}

