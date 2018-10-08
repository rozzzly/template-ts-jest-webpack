import * as React from 'react';
import * as ink from 'ink';
import CompilerTracker from '../CompilerTracker';


export interface ErrorDisplayItemProps {
    id: string;
    errors: any[];
    warnings: any[];
}

export const ErrorDisplayItem: ink.SFC<ErrorDisplayItemProps> = ({ id, errors, warnings }) => (
    <div>
        <ink.Color hex='#999999' bgRed bold>{` [ ${id} ] `}</ink.Color>
        <br />
        {
            errors.map(error => (
                String(error)
            ))
        }
        {
            warnings.map(warning => (
                String(warning)
            ))
        }
    </div>
);


export interface ErrorDisplayProps {
    tracker: CompilerTracker<string>;
}

export const ErrorDisplay: ink.SFC<ErrorDisplayProps> = ({ tracker }) => (
    <div>
        {
            tracker.map((handle, id) => {
                if (handle.state.status === 'dirty') {
                    return (
                        <ErrorDisplayItem errors={handle.state.errors} warnings={handle.state.warnings} id={id} />
                    );
                } else {
                    return null;
                }
            })
        }
    </div>
);

export default ErrorDisplay;
