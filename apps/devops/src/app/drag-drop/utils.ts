export function findIndex(element: Element): number {
  const allElements = element.parentElement.children;

  return Array.prototype.indexOf.call(allElements, element);
}
