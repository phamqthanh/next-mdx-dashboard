import { mdxAnnotations } from "mdx-annotations";

export const remarkPlugins = [
  () => (tree) => {
    console.log("remark", tree);
    return tree;
  },
  mdxAnnotations.remark,
];
