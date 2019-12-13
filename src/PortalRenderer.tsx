import * as React from "react";
import * as ReactDOM from "react-dom";

interface PortalComponent {
    id: string,
    portal: React.ReactPortal
}

export interface IPortalRenderer {
    render: (id: string, children: React.ReactNode, container: Element) => void,
    unmount: (id: string) => void
}

export const PortalRenderer: React.ForwardRefExoticComponent<React.RefAttributes<IPortalRenderer>> = React.forwardRef((props, ref) => {

    const [ portalComponents, setPortalComponents ] = React.useState<PortalComponent[]>([]);

    React.useImperativeHandle(ref, () => ({

        render(id: string, children: React.ReactNode, container: Element) {
            container.id = id;
            const portal = ReactDOM.createPortal(children, container, id);
            const index = portalComponents.findIndex(c => c.id === id);
            if (index === -1) setPortalComponents(portalComponents => [
                ...portalComponents,
                {id, portal}
            ]);
        },

        unmount(id: string) {
            const container = document.getElementById(id);
            if (container) ReactDOM.unmountComponentAtNode(container);
            setPortalComponents(portalComponents => {
                const arry = [...portalComponents];
                const index = arry.findIndex(c => c.id === id);
                if(index > -1) arry.splice(index,1);
                return arry;
            })
        }
    }));

    return (
        <React.Fragment>
            {portalComponents.map(portalComponent =>
                <React.Fragment key={portalComponent.id}>
                    {portalComponent.portal}
                </React.Fragment>
            )}
        </React.Fragment>
    );
});