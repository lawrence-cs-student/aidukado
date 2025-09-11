import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";

export default function Modal({ isOpen, onClose, title, children, panelStyle }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog className="relative z-50" onClose={onClose}>
        
        {/* Overlay */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/50 transition-opacity duration-200 ease-out"
        />

        {/* Modal box */}
        <div className="fixed inset-0 flex items-center justify-center p-2">
          <TransitionChild
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            className = "rounded-2xl"
          >
            <DialogPanel className={panelStyle}>
              <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
              <div className="mt-2 w-full h-full">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
