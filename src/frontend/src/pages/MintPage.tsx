import { createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@/providers/WalletProvider";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_NAME_LENGTH = 100;
const MAX_DESC_LENGTH = 500;
const BACKEND_CANISTER_ID = "zqdrq-zqaaa-aaaam-afzhq-cai";

interface SuccessInfo {
  tokenId: bigint;
  name: string;
  previewUrl: string;
}

interface FormErrors {
  image?: string;
  name?: string;
  description?: string;
}

export function MintPage() {
  const { walletType, plugActor, principal } = useWallet();
  const { actor: iiActor } = useActor(createActor);
  const queryClient = useQueryClient();

  // Resolve the right actor: Plug uses its own authenticated actor; II uses useActor
  const actor = walletType === "plug" ? plugActor : iiActor;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<SuccessInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!imageFile) next.image = "Please select an image to mint.";
    if (!name.trim()) next.name = "NFT name is required.";
    else if (name.length > MAX_NAME_LENGTH)
      next.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
    if (description.length > MAX_DESC_LENGTH)
      next.description = `Description must be ${MAX_DESC_LENGTH} characters or fewer.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (!file) return;
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setErrors((e) => ({
          ...e,
          image: "Only PNG and JPG images are supported.",
        }));
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setErrors((e) => ({
          ...e,
          image: "Image must be 5MB or smaller.",
        }));
        return;
      }
      setErrors((e) => ({ ...e, image: undefined }));
      setImageFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [previewUrl],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0] ?? null;
      handleFileChange(file);
    },
    [handleFileChange],
  );

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl(null);
    setErrors((e) => ({ ...e, image: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const mintMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !imageFile) throw new Error("Not ready to mint.");
      console.log(
        `[Mint] Submitting mint as principal: ${principal ?? "unknown"} via ${walletType ?? "unknown"} wallet`,
      );
      const arrayBuffer = await imageFile.arrayBuffer();
      const imageBytes = new Uint8Array(arrayBuffer);
      const result = await actor.mint(
        name.trim(),
        description.trim(),
        imageBytes,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (tokenId) => {
      setSuccess({
        tokenId,
        name: name.trim(),
        previewUrl: previewUrl ?? "",
      });
      // Invalidate gallery query so it auto-refreshes when user navigates there
      queryClient.invalidateQueries({ queryKey: ["nfts-by-owner"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mintMutation.mutate();
  };

  const handleMintAnother = () => {
    removeImage();
    setName("");
    setDescription("");
    setErrors({});
    setSuccess(null);
    mintMutation.reset();
  };

  const dashboardUrl = `https://dashboard.internetcomputer.org/canister/${BACKEND_CANISTER_ID}`;

  // showSuccess drives CSS visibility — both trees always stay in DOM
  const showSuccess = success !== null;

  // Stable string values for success section — avoids null access
  const successName = success?.name ?? "";
  const successPreviewUrl = success?.previewUrl ?? "";
  const successTokenId = success?.tokenId?.toString() ?? "";

  return (
    <Layout>
      {/* Single stable outer container — NEVER conditionally rendered */}
      <div className="flex-1 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Page header — always present */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-display font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              ICP NFT Minting
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Create NFT
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Upload an image, give it a name, and mint it on the Internet
              Computer.
            </p>
          </div>

          {/* SUCCESS CARD — always in DOM, toggled via CSS display */}
          <div
            aria-hidden={!showSuccess}
            style={{ display: showSuccess ? "block" : "none" }}
            data-ocid="mint.success_state"
          >
            <Card className="bg-card border border-border card-shadow-elevated overflow-hidden">
              {/* Green accent top bar */}
              <div className="h-1.5 bg-accent" />
              <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-6">
                {/* Check icon */}
                <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>

                <div className="space-y-1.5">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    NFT Minted!
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Your NFT has been successfully minted and added to your
                    collection on the Internet Computer.
                  </p>
                </div>

                {/* NFT Preview — stable outer container, image src is always a string */}
                <div className="w-full max-w-xs space-y-3">
                  <div className="rounded-xl overflow-hidden border border-border aspect-square bg-muted">
                    {/* Image container — always present, hidden when no preview */}
                    <div
                      style={{ display: successPreviewUrl ? "block" : "none" }}
                      className="w-full h-full"
                    >
                      <img
                        src={successPreviewUrl || ""}
                        alt={successName}
                        className="w-full h-full object-cover"
                        data-ocid="mint.success_image_preview"
                      />
                    </div>
                    {/* Fallback icon — always present, hidden when preview exists */}
                    <div
                      style={{ display: successPreviewUrl ? "none" : "flex" }}
                      className="w-full h-full items-center justify-center"
                    >
                      <ImagePlus className="w-10 h-10 text-muted-foreground opacity-40" />
                    </div>
                  </div>
                  <p
                    className="font-display font-semibold text-foreground text-base"
                    data-ocid="mint.success_nft_name"
                  >
                    {successName}
                  </p>
                </div>

                {/* Token ID badge */}
                <div
                  className="flex items-center gap-2 bg-muted/60 border border-border rounded-lg px-4 py-2.5"
                  data-ocid="mint.success_token_id"
                >
                  <span className="text-xs text-muted-foreground font-body">
                    Token ID
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    #{successTokenId}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 font-display transition-smooth"
                    data-ocid="mint.dashboard_link"
                  >
                    <a
                      href={dashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-1.5" />
                      View on Dashboard
                    </a>
                  </Button>
                  <Button
                    onClick={handleMintAnother}
                    className="flex-1 font-display transition-smooth"
                    data-ocid="mint.mint_another_button"
                  >
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Mint Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MINT FORM — always in DOM, hidden when success is showing */}
          <div
            aria-hidden={showSuccess}
            style={{ display: showSuccess ? "none" : "block" }}
          >
            <Card
              className="bg-card border border-border card-shadow-elevated"
              data-ocid="mint.form_card"
            >
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg">
                  NFT Details
                </CardTitle>
                <CardDescription className="text-sm">
                  Fill in the details below to mint your NFT on chain.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Image upload — stable outer wrapper always in DOM */}
                  <div className="space-y-2">
                    <Label className="font-display font-medium text-sm">
                      Image{" "}
                      <span className="text-destructive" aria-hidden>
                        *
                      </span>
                    </Label>

                    {/* Outer container — always present, never swapped */}
                    <div className="relative">
                      {/* Preview section — always in DOM, hidden when no image */}
                      <div
                        style={{ display: previewUrl ? "block" : "none" }}
                        className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-muted"
                      >
                        <img
                          src={previewUrl || ""}
                          alt="NFT preview"
                          className="w-full h-full object-contain"
                          data-ocid="mint.image_preview"
                        />
                        <button
                          type="button"
                          aria-label="Remove image"
                          data-ocid="mint.remove_image_button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Dropzone — always in DOM, hidden when preview exists */}
                      <div
                        style={{ display: previewUrl ? "none" : "block" }}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        data-ocid="mint.image_dropzone"
                        className={`w-full rounded-xl border-2 border-dashed aspect-video ${
                          errors.image
                            ? "border-destructive/50 bg-destructive/5"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer transition-smooth hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <ImagePlus className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-display font-medium text-foreground">
                              Click or drag to upload
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              PNG or JPG · Max 5MB
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      data-ocid="mint.image_input"
                      onChange={(e) =>
                        handleFileChange(e.target.files?.[0] ?? null)
                      }
                    />

                    {/* Stable error container — always in DOM */}
                    <div style={{ display: errors.image ? "block" : "none" }}>
                      <FieldError
                        message={errors.image || ""}
                        id="mint.image_field_error"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="nft-name"
                        className="font-display font-medium text-sm"
                      >
                        Name{" "}
                        <span className="text-destructive" aria-hidden>
                          *
                        </span>
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {name.length}/{MAX_NAME_LENGTH}
                      </span>
                    </div>
                    <Input
                      id="nft-name"
                      data-ocid="mint.name_input"
                      placeholder="My Awesome NFT"
                      value={name}
                      maxLength={MAX_NAME_LENGTH}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => {
                        if (!name.trim())
                          setErrors((x) => ({
                            ...x,
                            name: "NFT name is required.",
                          }));
                        else setErrors((x) => ({ ...x, name: undefined }));
                      }}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={errors.name ? "border-destructive/50" : ""}
                    />
                    {/* Stable error container — always in DOM */}
                    <div style={{ display: errors.name ? "block" : "none" }}>
                      <FieldError
                        message={errors.name || ""}
                        id="mint.name_field_error"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="nft-desc"
                        className="font-display font-medium text-sm"
                      >
                        Description{" "}
                        <span className="text-muted-foreground text-xs font-normal">
                          (optional)
                        </span>
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {description.length}/{MAX_DESC_LENGTH}
                      </span>
                    </div>
                    <Textarea
                      id="nft-desc"
                      data-ocid="mint.description_textarea"
                      placeholder="Describe your NFT..."
                      value={description}
                      maxLength={MAX_DESC_LENGTH}
                      rows={3}
                      onChange={(e) => setDescription(e.target.value)}
                      onBlur={() => {
                        if (description.length > MAX_DESC_LENGTH)
                          setErrors((x) => ({
                            ...x,
                            description: `Max ${MAX_DESC_LENGTH} characters.`,
                          }));
                        else
                          setErrors((x) => ({
                            ...x,
                            description: undefined,
                          }));
                      }}
                      aria-invalid={!!errors.description}
                      className={
                        errors.description ? "border-destructive/50" : ""
                      }
                    />
                    {/* Stable error container — always in DOM */}
                    <div
                      style={{ display: errors.description ? "block" : "none" }}
                    >
                      <FieldError
                        message={errors.description || ""}
                        id="mint.description_field_error"
                      />
                    </div>
                  </div>

                  {/* Backend error — stable container, always in DOM */}
                  <div
                    style={{ display: mintMutation.isError ? "block" : "none" }}
                  >
                    <div
                      data-ocid="mint.error_state"
                      className="flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3"
                    >
                      <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      <p className="text-sm text-destructive">
                        {mintMutation.error instanceof Error
                          ? mintMutation.error.message
                          : "Minting failed. Please try again."}
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    data-ocid="mint.submit_button"
                    disabled={mintMutation.isPending}
                    className="w-full font-display font-semibold transition-smooth"
                    size="lg"
                  >
                    {/* Loading state — always both spans in DOM, toggled via CSS */}
                    <span
                      style={{
                        display: mintMutation.isPending ? "flex" : "none",
                      }}
                      className="items-center justify-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Minting…
                    </span>
                    <span
                      style={{
                        display: mintMutation.isPending ? "none" : "flex",
                      }}
                      className="items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Mint NFT
                    </span>
                  </Button>

                  {/* Loading hint — stable container, always in DOM */}
                  <div
                    style={{
                      display: mintMutation.isPending ? "block" : "none",
                    }}
                  >
                    <p
                      className="text-center text-xs text-muted-foreground"
                      data-ocid="mint.loading_state"
                    >
                      Submitting to the Internet Computer — this may take a few
                      seconds.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function FieldError({ message, id }: { message: string; id: string }) {
  return (
    <p
      id={id}
      data-ocid={id}
      role="alert"
      className="flex items-center gap-1.5 text-xs text-destructive mt-1"
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
}
