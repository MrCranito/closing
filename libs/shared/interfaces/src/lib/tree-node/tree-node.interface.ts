export interface TreeNode {
  id: string;
  name: string;
  description?: string;
  children?: TreeNode[];
}
