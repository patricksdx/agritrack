"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AlertOptions = {
    title: string;
    description: string;
    variant?: "default" | "destructive";
    autoClose?: number;
    showButtons?: boolean;
    confirmable?: boolean;
    action?: () => void | Promise<void>;
    customContent?: React.ReactNode;
    buttonLabels?: {
        confirm?: string;
        cancel?: string;
        close?: string;
    };
};

let alertDialogHandler:
    | ((opts: AlertOptions) => Promise<boolean> | void)
    | null = null;

/** Función global accesible en toda la app */
export function showAlertDialog(opts: AlertOptions): Promise<boolean> | void {
    if (alertDialogHandler) return alertDialogHandler(opts);
}

export default function ShowAlertDialog() {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<AlertOptions>({
        title: "",
        description: "",
        variant: "default",
        showButtons: true,
    });
    const [resolver, setResolver] = useState<(val: boolean) => void>();

    useEffect(() => {
        alertDialogHandler = (opts: AlertOptions) => {
            setOptions({ showButtons: true, ...opts });
            setOpen(true);

            if (opts.autoClose) {
                setTimeout(() => {
                    setOpen(false);
                    resolver?.(false);
                }, opts.autoClose);
            }

            if (opts.confirmable) {
                return new Promise<boolean>((resolve) => {
                    setResolver(() => resolve);
                });
            }
        };

        return () => {
            alertDialogHandler = null;
        };
    }, [resolver]);

    const handleClose = () => {
        setOpen(false);
        resolver?.(false);
    };

    const handleConfirm = async () => {
        setOpen(false);
        if (options.action) {
            await options.action();
        }
        resolver?.(true);
    };

    const { confirm = "Confirmar", close = "Cerrar" } =
        options.buttonLabels || {};

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-5/6">
                <DialogHeader>
                    <DialogTitle
                        className={`${options.variant === "destructive" ? "text-red-700" : ""
                            } text-start`}
                    >
                        {options.title}
                    </DialogTitle>
                    <DialogDescription
                        className={`${options.variant === "destructive" ? "text-red-900" : ""
                            }
            text-start`}
                    >
                        {options.description}
                    </DialogDescription>
                </DialogHeader>

                {options.customContent && (
                    <div className="mt-4">{options.customContent}</div>
                )}

                {options.showButtons !== false && (
                    <div className="flex justify-end gap-2">
                        {options.confirmable ? (
                            <>
                                <Button onClick={handleConfirm} variant={options.variant}>
                                    {confirm}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={handleClose} variant={options.variant}>
                                {close}
                            </Button>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}