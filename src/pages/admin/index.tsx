import { SecondaryLayoutRoot } from "@/components/layouts/secondary/layout";
import { NextPage } from "next";
import React from "react";

type PageProps = {};
const DashboardPage: NextPage<PageProps> = (props) => {
  return <div>DashboardPage</div>;
};

DashboardPage.getLayout = SecondaryLayoutRoot;
export default DashboardPage;
