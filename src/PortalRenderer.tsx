import * as React from "react";
import * as ReactDOM from "react-dom";

interface PortalComponent {
    id: string,
    portal: React.ReactPortal
}

interface PortalRendererProps {
    children: (portals: JSX.Element[]) => React.ReactNode
}

export interface IPortalRenderer {
    render: (id: string, children: React.ReactNode, container: Element) => void,
    unmount: (id: string) => void
}

export const PortalRenderer = React.forwardRef<IPortalRenderer, PortalRendererProps>((props, ref) => {

    const [ portalComponents, setPortalComponents ] = React.useState<PortalComponent[]>([]);

    React.useImperativeHandle(ref, () => ({

        /**
         * Render a component under the same render tree of the calling application.
         * Editor context is also accessible from within.
         * @param id a unique identifier for the component, that will also be used later when unmounting
         * @param component the component you want to render to the container
         * @param container any html element where the component will reside
         */
        render(id: string, component: React.ReactNode, container: Element) {
            container.id = id;
            const portal = ReactDOM.createPortal(component, container, id);
            
            setPortalComponents(portalComponents => {
                const index = portalComponents.findIndex(c => c.id === id);
                if (index === -1) {
                    return [
                        ...portalComponents,
                        {id, portal}
                    ] 
                } else return portalComponents
            });
        },

        /**
         * Unmount a component rendered by the render() method
         * @param id the unique identifier for the compoent you wish to unmount
         */
        unmount(id: string) {
            setPortalComponents(portalComponents => {
                const arry = [...portalComponents];
                const index = arry.findIndex(c => c.id === id);
                if(index > -1) arry.splice(index,1);
                return arry;
            });
        }
    }));

    return (
        <React.Fragment>
            {props.children(
                portalComponents.map(portalComponent =>
                    <React.Fragment key={portalComponent.id}>
                        {portalComponent.portal}
                    </React.Fragment>
                )
            )}
        </React.Fragment>
    );
});