import * as React from 'react';
import render from '..';

describe('mounting', () => {
    it('explodes', () => {
        const SfcString: React.SFC<{ name: string }> = ({ name }) => (
            <>you`re name is: {name}</>
        );
        const Derp: React.SFC<{ color: string }> = (props) => (
            <span data-style={props} data-other={null}>
                <div>derp</div>
                <SfcString name={`fuck you ${props.color}`} />
            </span>
        );
        const unmount = render(() => (
            <Derp color='red' />
        ));
        expect(unmount).toBeTruthy();
    });
});
