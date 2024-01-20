import { LegacyRef, forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const BoostModal = forwardRef(({ children, show, onClose, title, useCustomConfirmButton }: 
    { children?: any, show: boolean, onClose?: () => void, title?: string, useCustomConfirmButton?: boolean }, ref) => {

    const btnRef: LegacyRef<HTMLButtonElement> = useRef(null);

    useImperativeHandle(ref, () => ({

        closeModal() {
            if (btnRef?.current) {
                btnRef.current.click();
            }
        }
    
      }));

    useEffect(() => {
        if (show && btnRef?.current) {
            btnRef.current.click();
        }
    }, [show, btnRef]);
    useEffect(() => {
        const exampleModal = document.getElementById('exampleModal');
        if (exampleModal) {
            exampleModal.addEventListener('click', function (e) {
                if (this.classList.contains('show')) {
                    onClose?.();
                }
            });
        }
    }, [onClose]);
    return <div>
        <button type="button" ref={btnRef} hidden className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        </button>

        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {title && <h5 className="modal-title" id="exampleModalLabel">{title}</h5>}
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => onClose?.()}></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => onClose?.()}>Close</button>
                        {!useCustomConfirmButton && <button type="button" className="btn btn-primary">Save changes</button>}
                    </div>
                </div>
            </div>
        </div>
    </div>
});

BoostModal.displayName = "BoostModal";
export default BoostModal;