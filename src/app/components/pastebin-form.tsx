"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { createPastebin } from "../lib/actions";
import { createPastebinSchema } from "../lib/validations";

export default function PastebinForm() {
  const [pasteUrl, setPasteUrl] = useState<string | null>(null);
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    createPastebin,
    zodResolver(createPastebinSchema),
    {
      actionProps: {
        onSuccess: ({ data }) => {
          if (data.success) {
            const newPasteUrl = `${window.location.origin}/${data.data?.id}`;

            setPasteUrl(newPasteUrl);

            toast.success(data.message, {
              action: {
                label: "Copy Link",
                onClick: () => {
                  copyToClipboard(newPasteUrl);
                  toast.success("Link copied to clipboard.");
                },
              },
            });
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
          content: "",
          expiration: "never",
          pinEnabled: false,
          pin: "",
        },
      },
      errorMapProps: {},
    },
  );

  const isPinEnabled = form.watch("pinEnabled");

  return (
    <div className="flex h-full w-full flex-col gap-4 lg:max-w-[460px]">
      <Form {...form}>
        <form onSubmit={handleSubmitWithAction} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="title-10">Paste the content here</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-muted lg:[216px] h-[223px] resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid items-start gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="expiration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="title-10 h-5">Expiration</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="caption-30 placeholder:text-secondary bg-muted w-full"
                        aria-label="Expiration"
                      >
                        <SelectValue placeholder="Never" />
                      </SelectTrigger>
                      <SelectContent className="caption-30">
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="once">One-time view</SelectItem>
                        <SelectItem value="1m">1 Minute</SelectItem>
                        <SelectItem value="10m">10 Minutes</SelectItem>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="1d">1 Day</SelectItem>
                        <SelectItem value="1w">1 Week</SelectItem>
                        <SelectItem value="2w">2 Weeks</SelectItem>
                        <SelectItem value="1mo">1 Month</SelectItem>
                        <SelectItem value="6mo">6 Months</SelectItem>
                        <SelectItem value="1y">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <div className="flex h-5 items-center justify-between">
                    <FormLabel className="title-10 h-5">PIN</FormLabel>
                    <Switch
                      checked={isPinEnabled}
                      onCheckedChange={(checked) => {
                        form.setValue("pinEnabled", checked, { shouldValidate: true });
                        if (!checked) {
                          form.setValue("pin", "", { shouldValidate: true });
                        }
                      }}
                      aria-label="Enable PIN"
                    />
                  </div>
                  <FormControl className="relative">
                    <div>
                      <Input
                        {...field}
                        value={typeof field.value === "string" ? field.value : ""}
                        disabled={!isPinEnabled}
                        type="password"
                        className="caption-30"
                        placeholder="Enter PIN"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={action.isPending}>
            {action.isPending && <Spinner className="size-4" />}
            Create paste
          </Button>
        </form>
      </Form>
      {pasteUrl && (
        <InputGroup>
          <InputGroupInput value={pasteUrl} readOnly />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Copy"
              title="Copy"
              size="icon-xs"
              onClick={() => {
                copyToClipboard(pasteUrl);
                toast.success("Link copied to clipboard.");
              }}
            >
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      )}
    </div>
  );
}
