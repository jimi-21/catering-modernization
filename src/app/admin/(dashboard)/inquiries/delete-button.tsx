"use client";

import { useId, useRef } from "react";
import { Trash2, X } from "lucide-react";
import { deleteInquiry } from "./actions";

export function DeleteInquiryButton({ id, name }: { id: string; name: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <>
      <button
        type="button"
        aria-label={`删除咨询 ${name}`}
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d7aaa2] px-3 text-xs font-medium text-[#9d3f30] hover:bg-[#fff3f0]"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        删除咨询
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border-0 p-6 text-[#18352e] shadow-2xl backdrop:bg-[#102f28]/55"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold">
            删除这条咨询？
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="grid size-9 place-items-center rounded-full hover:bg-[#eef1ed]"
            aria-label="关闭删除确认"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-7 text-[#64716c]">
          {name} 的联系方式与需求内容将永久删除。请确认已经完成跟进或符合数据清理要求。
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="min-h-11 rounded-lg border border-[#cbd4ce] px-4 text-sm"
          >
            取消
          </button>
          <form action={deleteInquiry}>
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="min-h-11 w-full rounded-lg bg-[#9d3f30] px-4 text-sm font-medium text-white sm:w-auto"
            >
              确认删除咨询
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
