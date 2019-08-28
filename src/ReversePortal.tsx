import * as React from 'react';

interface IComponentProps {
    el: HTMLElement
}

export class ReversePortal extends React.Component<IComponentProps> {
    private readonly ref = React.createRef<HTMLDivElement>();

    componentDidMount() {
        this.ref.current!.appendChild(this.props.el);
    }

    render() {
        return <div ref={this.ref} />
    }
}