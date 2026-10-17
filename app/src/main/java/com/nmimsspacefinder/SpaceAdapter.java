package com.nmimsspacefinder;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class SpaceAdapter extends RecyclerView.Adapter<SpaceAdapter.Holder> {

    public interface OnSpaceClickListener {
        void onSpaceClick(Space space);
    }

    private final List<Space> items = new ArrayList<>();
    private final OnSpaceClickListener listener;

    public SpaceAdapter(OnSpaceClickListener listener) {
        this.listener = listener;
    }

    public void setItems(List<Space> newItems) {
        items.clear();
        if (newItems != null) items.addAll(newItems);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public Holder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_space, parent, false);
        return new Holder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull Holder holder, int position) {
        final Space space = items.get(position);
        holder.name.setText(space.name);
        holder.type.setText(space.typeLabel);
        holder.location.setText(space.getLocationSummary());
        holder.badge.setText(space.availability.label);
        holder.badge.setBackgroundResource(space.availability.badgeRes);
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onSpaceClick(space);
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class Holder extends RecyclerView.ViewHolder {
        final TextView name;
        final TextView type;
        final TextView location;
        final TextView badge;

        Holder(@NonNull View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.spaceName);
            type = itemView.findViewById(R.id.spaceType);
            location = itemView.findViewById(R.id.spaceLocation);
            badge = itemView.findViewById(R.id.spaceBadge);
        }
    }
}