import LoadingItem from "@/components/molecules/LoadingItem";
import LoadingList from "@/components/molecules/LoadingList";
import LoadingPage from "@/components/molecules/LoadingPage";

export default function Loading({ type = 'page' } : { type?: 'item' | 'list' | 'page' }) {
  return (
    <>
      { type == 'page' && <LoadingPage/> }
      { type == 'list' && <LoadingList/> }
      { type == 'item' && <LoadingItem/> }
    </>
  )
}