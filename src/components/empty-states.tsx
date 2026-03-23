import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyProposalsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/30">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold text-white mb-2">Aucun devis encore</h3>
        <p className="text-slate-400 mb-6">
          Commencez par créer votre premier devis. Notre IA vous aidera à le générer en quelques minutes.
        </p>
        <Link href="/app/new">
          <Button size="lg" className="w-full">
            Créer mon premier devis
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function EmptyProposalsFREN() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/30">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold text-white mb-2">No proposals yet</h3>
        <p className="text-slate-400 mb-6">
          Start by creating your first proposal. Our AI will help you generate it in minutes.
        </p>
        <Link href="/app/new">
          <Button size="lg" className="w-full">
            Create my first proposal
          </Button>
        </Link>
      </div>
    </div>
  );
}
