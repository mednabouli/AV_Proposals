import Link from "next/link";
import { buttonVariants } from "./ui/button-variants";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyProposalsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/30 transition-all duration-200">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
          <FileText className="h-8 w-8 text-slate-400" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Aucun devis encore</h3>
        <p className="text-slate-400 mb-6 leading-relaxed max-w-[65ch]">
          Commencez par créer votre premier devis. Notre IA vous aidera à le générer en quelques minutes.
        </p>
        <Link 
          href="/app/new"
          className={cn(buttonVariants({ size: "lg" }), "w-full cursor-pointer touch-manipulation min-h-[44px]")}
        >
          Créer mon premier devis
        </Link>
      </div>
    </div>
  );
}

export function EmptyProposalsFREN() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/30 transition-all duration-200">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
          <FileText className="h-8 w-8 text-slate-400" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No proposals yet</h3>
        <p className="text-slate-400 mb-6 leading-relaxed max-w-[65ch]">
          Start by creating your first proposal. Our AI will help you generate it in minutes.
        </p>
        <Link 
          href="/app/new"
          className={cn(buttonVariants({ size: "lg" }), "w-full cursor-pointer touch-manipulation min-h-[44px]")}
        >
          Create my first proposal
        </Link>
      </div>
    </div>
  );
}
