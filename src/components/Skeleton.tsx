import React from 'react';

export function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-sm ${className}`} />
  );
}

export function ProjectSkeleton() {
  return (
    <div className="flex flex-col bg-surface-brand border border-border-brand p-6 h-[260px]">
      <div className="flex justify-between items-center">
        <SkeletonPulse className="h-3.5 w-12" />
        <SkeletonPulse className="h-3.5 w-16" />
      </div>
      <SkeletonPulse className="h-5 w-3/4 mt-4" />
      <SkeletonPulse className="h-12 w-full mt-3" />
      <div className="flex gap-1.5 mt-auto">
        <SkeletonPulse className="h-5 w-14" />
        <SkeletonPulse className="h-5 w-16" />
        <SkeletonPulse className="h-5 w-12" />
      </div>
    </div>
  );
}

export function CertSkeleton() {
  return (
    <div className="bg-surface-brand border border-border-brand p-6 flex flex-col justify-between h-[180px]">
      <div>
        <div className="flex justify-between">
          <SkeletonPulse className="h-3 w-16" />
          <SkeletonPulse className="h-3 w-12" />
        </div>
        <SkeletonPulse className="h-5 w-11/12 mt-4" />
      </div>
      <div>
        <div className="h-px bg-white/5 my-3 w-full" />
        <SkeletonPulse className="h-3 w-24" />
      </div>
    </div>
  );
}

export const CertificateSkeleton = CertSkeleton;

export function EducationSkeleton() {
  return (
    <div className="relative overflow-hidden bg-surface-brand border border-border-brand p-6 md:p-8 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
      <div className="md:w-2/3 flex flex-col gap-3">
        <SkeletonPulse className="h-3.5 w-24" />
        <SkeletonPulse className="h-5 w-1/2 mt-1" />
        <SkeletonPulse className="h-4 w-2/3" />
        <SkeletonPulse className="h-4 w-5/6 mt-2" />
      </div>
      <div className="md:w-1/3 flex flex-col md:items-end justify-center py-2 md:border-l md:border-border-brand/40 md:pl-8 gap-2">
        <SkeletonPulse className="h-3 w-16" />
        <SkeletonPulse className="h-8 w-24 mt-1" />
      </div>
    </div>
  );
}

export function BlogSkeleton() {
  return (
    <div className="bg-surface-brand border border-border-brand p-6 flex flex-col gap-4 h-[220px]">
      <div className="flex justify-between">
        <SkeletonPulse className="h-3 w-20" />
        <SkeletonPulse className="h-3 w-16" />
      </div>
      <SkeletonPulse className="h-5 w-11/12" />
      <SkeletonPulse className="h-12 w-full" />
      <SkeletonPulse className="h-3 w-28 mt-auto" />
    </div>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="bg-surface-brand border border-border-brand p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div className="flex-grow flex flex-col gap-3">
        <SkeletonPulse className="h-3 w-32" />
        <SkeletonPulse className="h-5 w-1/3" />
        <SkeletonPulse className="h-10 w-4/5 mt-1" />
        <div className="flex gap-2 mt-2">
          <SkeletonPulse className="h-5 w-14" />
          <SkeletonPulse className="h-5 w-14" />
        </div>
      </div>
    </div>
  );
}

export function SkillCategorySkeleton() {
  return (
    <div className="bg-surface-brand border border-border-brand p-6 flex flex-col gap-4">
      <SkeletonPulse className="h-4 w-28" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-8 w-20" />
        ))}
      </div>
    </div>
  );
}

export function GithubSkeleton() {
  return (
    <div className="bg-surface-brand border border-border-brand p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-border-brand/40 pb-4">
        <SkeletonPulse className="h-4 w-40" />
        <SkeletonPulse className="h-3 w-24" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border-brand/40 p-4 flex flex-col gap-2">
            <SkeletonPulse className="h-3 w-16" />
            <SkeletonPulse className="h-6 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeetcodeSkeleton() {
  return (
    <div className="bg-surface-brand border border-border-brand p-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-4">
        <SkeletonPulse className="h-4 w-44" />
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-border-brand/40 p-4">
            <SkeletonPulse className="h-3 w-12 mb-2" />
            <SkeletonPulse className="h-6 w-16" />
          </div>
          <div className="border border-border-brand/40 p-4">
            <SkeletonPulse className="h-3 w-16 mb-2" />
            <SkeletonPulse className="h-6 w-16" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 justify-center items-center">
        <SkeletonPulse className="h-28 w-28 rounded-full" />
        <SkeletonPulse className="h-3 w-20 mt-2" />
      </div>
    </div>
  );
}
