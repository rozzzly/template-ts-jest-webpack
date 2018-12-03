import * as stringWidth from 'string-width';
import * as React from 'react';
import mount, { lookupInstance, MountedInstance } from '..';
import { Group } from '../Group';
import { Style } from '../Style';
import TextNode from '../../Tree/TextNode';
import { rowSpans } from '../../Renderer/tests/__qCoords';

describe('mounting', () => {

    let inst: MountedInstance;
    afterEach(() => inst.unmount() );

    it('will rerender the tree when inst.render() is called', () => {
        const Message: React.SFC<{ color: string, message: string }> = ({ message, color }) => (
            <Style color={color}>
                {message}
                (width = {stringWidth(message)})
            </Style>
        );
        const leadWidth = stringWidth('The message is: ');
        let messageColor = 'blue';
        let messageText = 'hello';
        inst = mount(() => (
            <Group flexDirection='column'>
                <Group>
                    The message is:
                    <Message message={messageText} color={messageColor} />
                </Group>
                <Group>
                    Some <Style color={messageColor} >mostly</Style> static content
                </Group>
            </Group>
        ), { width: 40, height: 3 });


        expect((inst.grid.root.children[1] as TextNode).textRaw).toBe('hello');
        messageText = 'world';
        messageColor = 'green';
        inst.render();
        expect((inst.grid.root.children[1] as TextNode).textRaw).toBe('world');


    });

    it('explodes', () => {
        const SfcString: React.SFC<{ name: string, color: string }> = ({ name, color }) => (
            <Group style={{color}}>you`re name is: {name}</Group>
        );
        // const Derp: React.SFC<{ color: string }> = (props) => (
        //     <span data-style={props} data-other={null}>
        //         <div>derp</div>
        //         <SfcString name={`fuck you ${props.color}`} />
        //     </span>
        // );
        inst = mount(() => (
            <Group flexDirection='column'>
                <SfcString name='bob' color='red' />
                <SfcString name='bill' color='orange' />
            </Group>
        ), {
            width: 20,
            height: 4
        });
        expect(inst).toBeTruthy();
        expect(inst.grid.width).toBe(20);
        expect(inst.grid.height).toBe(4);
    });
});
