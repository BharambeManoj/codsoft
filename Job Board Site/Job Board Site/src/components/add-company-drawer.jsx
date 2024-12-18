import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";


const schema = z.object({
  name: z.string().min(1, { message: "Company name required" }),
  logo: z.any().refine(
    (file) =>
      file[0] &&
      (file[0].type === "image/png" || file[0].type === "image/jpeg"), // PDF (format is application and not applications)

    { message: "Only PDF, DOC, and DOCX documents are allowed" }
  ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading : loadingAddCompany,
    error : errorAddCompany,
    data : dataAddCompany,
    fn : fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = ( data ) => {
    fnAddCompany({
        ...data,
        logo : data.logo[0],
    })
  };

  useEffect(() => {
    if(dataAddCompany?.length > 0 ) fetchCompanies();
  },[loadingAddCompany])

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="destructive">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>

        <form className="flex flex-row gap-3 p-4 pb-0">
          <Input placeholder="Company Name" {...register("name")} />

          <Input
            type="file"
            accept="image/*"
            className="file:text-gray-500"
            {...register("logo")}
          />

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="blue"
            className="w-40"
          >
            Add
          </Button>
        </form>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
        {errorAddCompany?.message && (
            <p className="text-red-500">{errorAddCompany?.message}</p>
        )}
        {loadingAddCompany && <BarLoader className="mt-4" width={"100%"} color="rgb(129, 29, 29)" />}
        <DrawerFooter>
          
          <DrawerClose>
            <Button variant="destructive" type="buttuon">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
