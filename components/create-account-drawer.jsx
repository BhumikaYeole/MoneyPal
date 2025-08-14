"use client";
import { useEffect, useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerTrigger,
    DrawerHeader,
    DrawerTitle,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { accountSchema } from "@/app/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/use-fetch";
import { createAccount } from "@/actions/dashboard";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function CreateAccountDrawer({ children }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "CURRENT",
            balance: 0,
            isDefault: false,
        },
    });

    const [open, setOpen] = useState(false);

    const {
        data: newAccount,
        fn: createAccountFunction,
        error,
        loading: createAccountLoading,
    } = useFetch(createAccount);

    const onSubmit = async (data) => {
        await createAccountFunction(data);
    };

    useEffect(() => {
        if (newAccount?.success && !createAccountLoading) {
            toast.success("Account created succesfully");
            reset();
            setOpen(false); 
        }
    }, [newAccount,createAccountLoading]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to create account");
            setOpen(false)
        }
    }, [error]);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent className={"mx-10"}>
                <DrawerTitle className={"pl-10"}>Create New Account</DrawerTitle>
                <div className="mb-4 px-10 ">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Name */}
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <Input
                                type="text"
                                id="name"
                                {...register("name")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Account Type */}
                        <div className="space-y-2">
                            <label
                                htmlFor="type"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Account Type
                            </label>
                            <Select
                                onValueChange={(value) => setValue("type", value)}
                                defaultValue={watch("type")}
                            >
                                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CURRENT">Current</SelectItem>
                                    <SelectItem value="SAVINGS">Savings</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-red-600">{errors.type.message}</p>
                            )}
                        </div>

                        {/* Initial Balance */}
                        <div className="space-y-2">
                            <label
                                htmlFor="balance"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Initial Balance
                            </label>
                            <Input
                                type="number"
                                id="balance"
                                step="0.01"
                                placeholder="0.00"
                                {...register("balance")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.balance && (
                                <p className="text-sm text-red-600">{errors.balance.message}</p>
                            )}
                        </div>

                        {/* Default Switch */}
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <label
                                htmlFor="isdefault"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Set as Default
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                                This account will be selected as default account for
                                transactions
                            </p>
                            <Switch
                                id="isdefault"
                                onCheckedChange={(checked) => setValue("isDefault", checked)}
                                checked={watch("isDefault")}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <DrawerClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                            </DrawerClose>
                            <Button type="submit" className="w-full sm:w-auto">
                                {createAccountLoading ? (
                                    <div className="flex flex-row gap-2">
                                        {" "}
                                        <Loader className={"animate-spin"} />{" "}
                                        <p>Creating acccount</p>{" "}
                                    </div>
                                ) : (
                                    <p>Create Account</p>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
