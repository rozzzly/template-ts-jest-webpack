import * as React from 'react';
import render, { lookupInstance } from '..';
import { Group } from '../Group';
import { Style } from '../Style';

describe('mounting', () => {
    it('explodes', () => {
        const SfcString: React.SFC<{ name: string, color: string }> = ({ name, color }) => (
            <Style color={color}>you`re name is: {name}</Style>
        );
        // const Derp: React.SFC<{ color: string }> = (props) => (
        //     <span data-style={props} data-other={null}>
        //         <div>derp</div>
        //         <SfcString name={`fuck you ${props.color}`} />
        //     </span>
        // );
        const unmount = render(() => (
            <Group flexDirection='column'>
                <SfcString name='bob' color='red' />
                <SfcString name='bill' color='orange' />
            </Group>
        ), {
            width: 20,
            height: 4
        });
        const instance = lookupInstance(unmount)!;
        expect(instance).toBeTruthy();
        expect(instance.grid.width).toBe(20);
        expect(instance.grid.height).toBe(4);
    });
});
