"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { KeyIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { verifyPastebin } from "../lib/actions";
import { verifyPastebinSchema } from "../lib/validations";

interface PinGateProps {
  id: string;
}

export default function PinGate({ id }: PinGateProps) {
  const router = useRouter();

  const { form, action, handleSubmitWithAction, resetFormAndAction } = useHookFormAction(
    verifyPastebin,
    zodResolver(verifyPastebinSchema),
    {
      actionProps: {
        onSuccess: ({ data }) => {
          if (data.success) {
            router.refresh();
          } else {
            toast.error(data.message);
          }
        },
        onError: ({ error }) => {
          if (error.validationErrors) {
            toast.error("Please fix the errors in the form.");
          } else if (error.serverError) {
            toast.error("Server error occurred. Please try again later.");
          }
        },
      },
      formProps: {
        defaultValues: {
          id,
          pin: "",
        },
      },
      errorMapProps: {},
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="items-center">
              <FormControl>
                <Input {...field} type="hidden" value={id} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem className="items-center">
              <FormLabel className="h-5 font-light">
                Please enter the PIN to access the paste
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter PIN"
                  disabled={action.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Button type="submit" disabled={action.isPending}>
            {action.isPending ? <Spinner className="size-4" /> : <KeyIcon className="size-4" />}
            Submit
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => resetFormAndAction()}
            disabled={action.isPending}
          >
            Clear
          </Button>
        </div>
      </form>
    </Form>
  );
}
