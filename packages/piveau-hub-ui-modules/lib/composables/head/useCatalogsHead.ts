import { useDatasetsHead } from "./useDatasetsHead";

export function useCatalogsHead() {
  return useDatasetsHead({ isCatalog: true });
}